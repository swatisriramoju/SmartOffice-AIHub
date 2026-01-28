# Simple HTTP Server using PowerShell
param(
    [int]$Port = 8080,
    [string]$Path = "."
)

Write-Host "Starting HTTP Server..." -ForegroundColor Green
Write-Host "Port: $Port" -ForegroundColor Cyan
Write-Host "Access at: http://localhost:$Port" -ForegroundColor Yellow

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")
$Listener.Start()

try {
    while ($true) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response
        
        $Url = $Request.Url.LocalPath
        if ($Url -eq "/") { $Url = "/index.html" }
        
        $FilePath = Join-Path $Path $Url.TrimStart('/')
        
        Write-Host "GET $Url" -ForegroundColor Gray
        
        if (Test-Path $FilePath -PathType Leaf) {
            $Content = [System.IO.File]::ReadAllBytes($FilePath)
            
            $Ext = [System.IO.Path]::GetExtension($FilePath)
            $ContentType = switch ($Ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                ".json" { "application/json" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            
            $Response.ContentType = $ContentType
            $Response.ContentLength64 = $Content.Length
            $Response.AddHeader("Access-Control-Allow-Origin", "*")
            $Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $Response.AddHeader("Access-Control-Allow-Headers", "Content-Type")
            $Response.OutputStream.Write($Content, 0, $Content.Length)
            Write-Host "  OK 200" -ForegroundColor Green
        } else {
            $Response.StatusCode = 404
            $NotFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $Response.OutputStream.Write($NotFound, 0, $NotFound.Length)
            Write-Host "  ERR 404" -ForegroundColor Red
        }
        
        $Response.OutputStream.Close()
    }
} finally {
    $Listener.Stop()
    Write-Host "Server stopped" -ForegroundColor Yellow
}
