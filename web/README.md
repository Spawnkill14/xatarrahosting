# XatarraHosting - README

## ✅ Estado del Proyecto

**Frontend:** 100% COMPLETO ✓
**Backend:** 0% (Por hacer)
**Base de Datos:** Schema listo (ver database-schema.sql)

## 🚀 Inicio Rápido

### 1. Importar Base de Datos
```bash
mysql -h 127.0.0.1 -u root -p < database-schema.sql
```

### 2. Instalar Backend (Node.js)
```bash
npm init
npm install express mysql2 jsonwebtoken bcrypt cors dotenv
npm install --save-dev nodemon
```

### 3. Crear archivo .env
```
API_PORT=3000
API_URL=http://192.168.1.151:3000
DATABASE_HOST=127.0.0.1
DATABASE_USER=xatarra_app
DATABASE_PASSWORD=secure_password_1234
DATABASE_NAME=xatarrahosting
JWT_SECRET=your-super-secret-key
PROXMOX_IP=192.168.1.150
PROXMOX_USER=root
```

### 4. Levantar servidor
```bash
npm start
```

Luego abre http://192.168.1.151:3000/api/health

## 📚 Documentación

- **config.js** - Configuración global (API_BASE_URL, JWT_SECRET)
- **api-client.js** - Cliente API con 25+ métodos
- **auth-guard.js** - Protección JWT
- **database-schema.sql** - Schema MySQL listo
- **HANDOVER_FOR_NEXT_AI.txt** - Guía para backend

## 🔑 Credenciales

- DB User: `xatarra_app`
- DB Password: `secure_password_1234`
- API Port: `3000`
- JWT Secret: `your-super-secret-key`

## 🎯 Siguiente Paso

Implementar endpoints del backend en /api/auth, /api/minecraft, /api/web
