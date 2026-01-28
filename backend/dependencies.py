"""
Authentication and dependency injection for FastAPI
Validates DEWA SSO tokens and manages current user context
"""

import os
import jwt
from datetime import datetime
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from sqlalchemy.orm import Session
from models import Employee
from schemas import CurrentUser, TokenPayload
from database import get_db

# Security configuration
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
DEWA_TOKEN_ISSUER = os.getenv("DEWA_TOKEN_ISSUER", "https://login.dewa.gov.ae")
DEWA_AUDIENCE = os.getenv("DEWA_AUDIENCE", "ai-hub.dewa.gov.ae")


class AuthenticationError(HTTPException):
    """Authentication error response"""
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class AuthorizationError(HTTPException):
    """Authorization error response"""
    def __init__(self, detail: str = "Insufficient permissions"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )


def decode_token(token: str) -> TokenPayload:
    """
    Decode and validate JWT token from DEWA SSO.
    
    In production, validate against DEWA's public keys.
    For now, uses shared secret key.
    """
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_signature": True}
        )
        
        # Validate issuer and audience
        if payload.get("iss") != DEWA_TOKEN_ISSUER:
            raise AuthenticationError("Invalid token issuer")
        
        if DEWA_AUDIENCE not in payload.get("aud", []):
            raise AuthenticationError("Invalid token audience")
        
        # Check expiration
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
            raise AuthenticationError("Token has expired")
        
        return TokenPayload(**payload)
    
    except jwt.ExpiredSignatureError:
        raise AuthenticationError("Token has expired")
    except jwt.InvalidTokenError as e:
        raise AuthenticationError(f"Invalid token: {str(e)}")


async def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> CurrentUser:
    """
    Get current authenticated user from JWT token and database.
    
    Validates token and fetches user from employees table.
    Can be used as a dependency in route handlers.
    
    Raises:
        AuthenticationError: If token is invalid or user not found
    
    Example:
        @app.get("/me")
        async def get_profile(user: CurrentUser = Depends(get_current_user)):
            return user
    """
    # Decode and validate token
    token_payload = decode_token(credentials.credentials)
    
    # Lookup user in database by email
    user = db.query(Employee).filter(
        Employee.email == token_payload.email
    ).first()
    
    if not user:
        raise AuthenticationError("User not found in system")
    
    if user.status != "active":
        raise AuthenticationError("User account is not active")
    
    # Return current user context
    return CurrentUser(
        employee_id=user.employee_id,
        email=user.email,
        display_name=user.display_name,
        department_id=user.department_id,
        role=user.role,
        status=user.status,
    )


async def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[CurrentUser]:
    """
    Optionally get current user. Returns None if not authenticated.
    
    Useful for endpoints that should work both authenticated and unauthenticated.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.replace("Bearer ", "")
    
    try:
        token_payload = decode_token(token)
        user = db.query(Employee).filter(
            Employee.email == token_payload.email
        ).first()
        
        if user and user.status == "active":
            return CurrentUser(
                employee_id=user.employee_id,
                email=user.email,
                display_name=user.display_name,
                department_id=user.department_id,
                role=user.role,
                status=user.status,
            )
    except:
        pass
    
    return None


def require_role(*allowed_roles: str):
    """
    Dependency factory for role-based access control.
    
    Usage:
        @app.post("/admin/users")
        async def create_user(
            user: CurrentUser = Depends(require_role("admin", "manager"))
        ):
            return {"status": "created"}
    """
    async def role_checker(user: CurrentUser = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise AuthorizationError(
                f"User role '{user.role}' not allowed. Required: {allowed_roles}"
            )
        return user
    
    return role_checker


def require_department(*allowed_depts: int):
    """
    Dependency factory for department-based access control.
    
    Usage:
        @app.get("/dept-report")
        async def get_dept_report(
            user: CurrentUser = Depends(require_department(1, 2))
        ):
            return {}
    """
    async def dept_checker(user: CurrentUser = Depends(get_current_user)):
        if user.department_id not in allowed_depts:
            raise AuthorizationError(
                "Your department does not have access to this resource"
            )
        return user
    
    return dept_checker


# ============================================
# REQUEST LOGGING & AUDIT
# ============================================

async def get_request_context(
    request: Request,
    user: Optional[CurrentUser] = Depends(get_current_user_optional)
):
    """
    Extract request context for audit logging.
    
    Returns dict with request metadata for audit trail.
    """
    return {
        "employee_id": user.employee_id if user else None,
        "email": user.email if user else None,
        "ip_address": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent"),
        "method": request.method,
        "path": request.url.path,
        "timestamp": datetime.utcnow(),
    }
