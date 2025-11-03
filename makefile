## ⚙️ CONFIG
AWS_REGION=eu-central-1
# Tandù-t3t: 986566047392
ACCOUNT_ID=986566047392
REPOSITORY_NAME=t3t/t3t-api
PROFILE=Tandu-t3t

ECR_URI=$(ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(REPOSITORY_NAME)
IMAGE_TAG=65

## 👋 Help
help:
	@echo ""
	@echo "Available commands:"
	@echo "  help                 Mostra questo messaggio di aiuto"
	@echo "  docker-build		   		Builda l'immagine Docker e la tagga"
	@echo "  docker-run		   			Esegue l'immagine Docker taggata"
	@echo "  docker-push		   		Esegue login su ECR, builda l'immagine Docker, la tagga e la push su ECR"
	@echo "  swagger-docs					Genera la documentazione Swagger"
	@echo ""

## 📄 Swagger api documentations
swagger-docs:
	@echo "📄 Generating Swagger API docs..."
	docker run --rm -i --platform linux/amd64 yousan/swagger-yaml-to-html < ./docs/api-docs.openai.yml > ./src/public/api-docs.html; \
	echo "<style>body{padding-bottom: 80px}.topbar{display: none !important}.swagger-ui .wrapper + .wrapper, .response-col_links, .try-out {display: none !important;}</style>" >>  ./src/public/api-docs.html \
	"<style>.swagger-ui .parameter__name.required {font-size: 13px !important;} </style>" >> ./src/public/api-docs.html \
	"<style>.parameters-col_name {min-width: 300px !important}</style>" >> ./src/public/api-docs.html

## 🐳 Docker build
# --progress=plain --no-cache
docker-build:
	@echo "🐳 Building Docker image..."
	docker build --platform linux/amd64,linux/arm64  -t $(REPOSITORY_NAME):$(IMAGE_TAG) .

## 🐳 Docker run
docker-run:
	@echo "🚀 Run Docker image..."
	docker run -d -p 3000:3000 $(REPOSITORY_NAME):$(IMAGE_TAG)

## 🚀 Push docker image to ECR
docker-push:
	@echo "[1/4] 🔐 Logging in to ECR..."
	@aws ecr get-login-password --region $(AWS_REGION) --profile $(PROFILE) | docker login --username AWS --password-stdin $(ECR_URI) 
	@echo ""
	@echo "[2/4] 🐳 Building Docker image..."
	docker build --platform linux/amd64,linux/arm64 -t $(REPOSITORY_NAME):$(IMAGE_TAG) .
	@echo ""
	@echo "[3/4] 🏷️  Tagging Docker image..."
	docker tag $(REPOSITORY_NAME):$(IMAGE_TAG) $(ECR_URI):$(IMAGE_TAG)
	@echo ""
	@echo "[4/4] 🚀 Pushing Docker image to ECR..."
	docker push $(ECR_URI):$(IMAGE_TAG)
	@echo ""
	@echo "✅ Image pushed to:"
	@echo "$(ECR_URI):$(IMAGE_TAG)"

## Digital Ocean build
build:
	docker exec t3t_app-ts npm run build
