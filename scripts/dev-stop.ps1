$connection = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1

if ($null -eq $connection) {
  Write-Output "No server on 4173"
  exit 0
}

Stop-Process -Id $connection.OwningProcess -Force
Write-Output "Stopped server on 4173"
