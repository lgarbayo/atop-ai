#!/bin/bash
# setup_ec2.sh — AUTOMACIÓN PARA AWS FREE TIER
# ------------------------------------------
# Este script prepara un servidor Ubuntu recién creado para ejecutar Meiga.

set -e

echo "🚀 Iniciando configuración del servidor..."

# 1. ACTUALIZAR SISTEMA
echo "🔄 Actualizando repositorios..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. CONFIGURAR SWAP (2GB)
# Las instancias t2.micro/t3.micro solo tienen 1GB de RAM. 
# El Swap es vital para evitar que Docker se cuelgue al buildear.
if [ ! -f /swapfile ]; then
    echo "🧠 Configurando 2GB de memoria Swap..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap configurada."
else
    echo "ℹ️  Swap ya configurada."
fi

# 3. INSTALAR DOCKER
if ! [ -x "$(command -v docker)" ]; then
    echo "🐳 Instalando Docker..."
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Permitir usar docker sin sudo
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado. Tendrás que reiniciar sesión para usarlo sin 'sudo'."
else
    echo "ℹ️  Docker ya está instalado."
fi

echo "------------------------------------------------"
echo "✅ SERVIDOR LISTO PARA MEIGA"
echo "------------------------------------------------"
echo "Próximos pasos:"
echo "1. Cierra esta sesión (exit) y vuelve a entrar por SSH para que los permisos de Docker surtan efecto."
echo "2. Clona el repositorio: git clone <URL_DEL_REPO>"
echo "3. Crea el archivo .env con tu GEMINI_API_KEY."
echo "4. Levanta la app: docker compose up -d"
