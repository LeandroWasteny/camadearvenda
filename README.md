# Borracharia 40 - Site de Venda de Câmara de Ar

Site promocional para venda de Câmara de Ar 90/90/18 da Borracharia 40.

## 🏍️ Produto
- **Câmara de Ar RTTE 300x18 (TR-4)**
- **Preço:** R$ 19,99
- **Compatível com:** Honda CG 125/150/160, Yamaha YBR/Factor e mais

## 📍 Localização
- **Endereço:** R. Dezenove, n°16 - Alto Alegre, Maracanaú-CE
- **WhatsApp:** (85) 9962-4489

## 🚀 Deploy com Docker

```bash
# Build da imagem
docker build -t borracharia40-site .

# Rodar o container
docker run -d -p 80:80 --name borracharia40 borracharia40-site
```

## 📁 Estrutura

```
├── index.html        # Página principal
├── styles.css        # Estilos
├── script.js         # Scripts
├── img/              # Imagens
│   ├── logo.jpg      # Logo Borracharia 40
│   ├── logo-dark.jpg # Logo fundo escuro
│   ├── produto.webp  # Foto do produto
│   ├── bg-1.jpg      # Background 1
│   └── bg-2.jpg      # Background 2
├── Dockerfile        # Config Docker (nginx:alpine)
├── nginx.conf        # Config Nginx
└── .dockerignore     # Arquivos ignorados no build
```
