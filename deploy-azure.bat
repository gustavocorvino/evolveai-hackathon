@echo off
REM ╔════════════════════════════════════════════════════════════════╗
REM ║   SCRIPT DE DEPLOY - Azure Static Web Apps                    ║
REM ║   Projeto: EvolveAI Hackathon                                  ║
REM ║   Data: 06/02/2026                                             ║
REM ╚════════════════════════════════════════════════════════════════╝

REM CORES PARA OUTPUT (não funciona em CMD tradicional, apenas PowerShell)
REM Esta é uma versão simplificada para CMD

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  DEPLOY - Azure Static Web Apps                              ║
echo ║  EvolveAI Hackathon                                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM ============ FASE 1: VERIFICAÇÕES PRÉ-DEPLOY ============
echo [FASE 1] Verificando pré-requisitos...
echo.

REM Verificar Azure CLI
where az >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO: Azure CLI não está instalado!
    echo    Instale em: https://aka.ms/installazurecliwindows
    pause
    exit /b 1
)
echo ✓ Azure CLI encontrado

REM Verificar Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO: Git não está instalado!
    pause
    exit /b 1
)
echo ✓ Git encontrado

REM Verificar que estamos na pasta certa
if not exist "package.json" (
    echo ❌ ERRO: package.json não encontrado!
    echo    Execute este script na pasta raiz do projeto
    pause
    exit /b 1
)
echo ✓ Projeto encontrado (package.json)

REM Verificar .env.local
if not exist ".env.local" (
    echo ❌ ERRO: .env.local não encontrado!
    echo    Execute: node setup-azure.js
    pause
    exit /b 1
)
echo ✓ .env.local configurado

echo.
echo ✓ Todas as verificações passaram!
echo.

REM ============ FASE 2: LOGIN AZURE ============
echo [FASE 2] Verificando login Azure...
az account show >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Você não está logado no Azure
    echo Abrindo navegador para autenticação...
    az login
) else (
    echo ✓ Já está logado no Azure
)
echo.

REM ============ FASE 3: CRIAR GRUPO DE RECURSOS ============
echo [FASE 3] Verificando grupo de recursos...
az group show --name evolveai-rg >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Criando grupo de recursos: evolveai-rg...
    az group create --name evolveai-rg --location eastus
    echo ✓ Grupo de recursos criado
) else (
    echo ✓ Grupo de recursos já existe
)
echo.

REM ============ FASE 4: CRIAR STATIC WEB APP ============
echo [FASE 4] Verificando Static Web App...
az staticwebapp show --name evolveai-hackathon-swa --resource-group evolveai-rg >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║  CONFIGURAÇÃO NECESSÁRIA                                      ║
    echo ╠════════════════════════════════════════════════════════════════╣
    echo ║                                                                ║
    echo ║  Para criar o Static Web App, você precisa de um token GitHub ║
    echo ║                                                                ║
    echo ║  1. Acesse: https://github.com/settings/tokens                ║
    echo ║                                                                ║
    echo ║  2. Clique "Generate new token" (classic)                     ║
    echo ║                                                                ║
    echo ║  3. Escopos necessários:                                       ║
    echo ║     - repo (todo)                                              ║
    echo ║     - workflow                                                 ║
    echo ║                                                                ║
    echo ║  4. Copie o token                                              ║
    echo ║                                                                ║
    echo ║  5. Volte aqui e cole quando solicitado                        ║
    echo ║                                                                ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    
    set /p GH_TOKEN=Cole seu GitHub Token: 
    
    if "!GH_TOKEN!"=="" (
        echo ❌ Token não fornecido
        exit /b 1
    )
    
    echo.
    echo Criando Static Web App (isso pode levar alguns minutos)...
    echo.
    
    REM Obter URL do repositório Git
    for /f "tokens=*" %%i in ('git config --get remote.origin.url') do set REPO_URL=%%i
    
    az staticwebapp create ^
        --name evolveai-hackathon-swa ^
        --resource-group evolveai-rg ^
        --source %REPO_URL% ^
        --location eastus ^
        --branch main ^
        --app-location "src" ^
        --output-location "dist" ^
        --token %GH_TOKEN%
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✓ Static Web App criado com sucesso!
    ) else (
        echo.
        echo ❌ Erro ao criar Static Web App
        pause
        exit /b 1
    )
) else (
    echo ✓ Static Web App já existe
)
echo.

REM ============ FASE 5: PREPARAR PARA DEPLOY ============
echo [FASE 5] Preparando para deploy...
echo.
echo Passos finais:
echo.
echo 1. Faça commit de suas alterações:
echo    git add .
echo    git commit -m "feat: migração para Azure Static Web Apps"
echo.
echo 2. Push para main:
echo    git push origin main
echo.
echo 3. O GitHub Actions iniciará automaticamente
echo.
echo 4. Monitor o deploy em:
echo    https://github.com/seu-usuario/seu-repo/actions
echo.

REM ============ FASE 6: INFORMAÇÕES DE ACESSO ============
echo [FASE 6] Obtendo informações da aplicação...
echo.

for /f "tokens=*" %%i in ('az staticwebapp show --name evolveai-hackathon-swa --resource-group evolveai-rg --query "defaultHostname" -o tsv') do set APP_URL=%%i

echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ✓ PRONTO PARA DEPLOY                                         ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║                                                                ║
echo ║  URL da Aplicação:                                             ║
echo ║  https://%APP_URL%
echo ║                                                                ║
echo ║  Portal Azure:                                                 ║
echo ║  https://portal.azure.com                                      ║
echo ║                                                                ║
echo ║  Próximos passos:                                              ║
echo ║  1. git push origin main                                       ║
echo ║  2. Aguarde deploy (~5 minutos)                                ║
echo ║  3. Acesse a URL acima                                         ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Deploy script finalizado!
echo.

pause
