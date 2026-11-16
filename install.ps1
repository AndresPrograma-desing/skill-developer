# Instala dependencias y las actualiza dentro de los rangos semver de package.json.
# Usa yarn (el gestor de paquetes de este proyecto); no reescribe versiones mayores.

$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot

function Invoke-Step {
    param(
        [string]$Name,
        [string]$Command
    )

    Write-Host ""
    Write-Host "==> $Name" -ForegroundColor Cyan

    Push-Location $projectRoot
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            Write-Host "x $Name fallo (exit code $LASTEXITCODE)" -ForegroundColor Red
            exit $LASTEXITCODE
        }
        Write-Host "OK $Name" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
}

Invoke-Step -Name 'Instalar dependencias (yarn install)' -Command 'yarn install'
Invoke-Step -Name 'Actualizar dentro de rangos semver (yarn upgrade)' -Command 'yarn upgrade'

Write-Host ""
Write-Host "Dependencias instaladas y actualizadas." -ForegroundColor Green
