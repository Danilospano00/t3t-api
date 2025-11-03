## 🏗️ STAGE 1: builder

# 🐳 We start from the official Node.js LTS image on Alpine
FROM node:lts-alpine AS builder

# 📂 Set the working directory to /app
WORKDIR /app

# 📑 Copy only package.json and package-lock.json first to take advantage of caching
COPY package*.json ./

COPY .env ./

# 📦 Install all dependencies (including devDependencies like TypeScript)
RUN npm install

# 📂 Now copy the source code, which changes more frequently
COPY ./src ./src

WORKDIR /app/src

# ⚙️ Run the build (TS → JS), generating the dist folder
RUN npm run build




## 🚀 STAGE 2: runner (runtime only)

# 🐳 Start again from Node.js LTS on Alpine for the final image
FROM node:lts-alpine AS runner

# 📂 Set the working directory to /app
WORKDIR /app

# Add dependencies necessary for Chromium
RUN apk update && apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ttf-freefont

# 🗂️ Copy only the dist folder (compiled code) from the builder
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/.env ./dist/.env
# 📦 Copy only the production dependencies (node_modules) from the builder
COPY --from=builder /app/node_modules ./dist/node_modules
# 📑 Copy the package.json and package-lock.json manifests if they are needed at runtime
COPY --from=builder /app/package*.json ./dist/


# 📂 Set the working directory to /app
WORKDIR /app/dist

# Add an environment variable for Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 🌐 Expose the port on which the app runs (3000)
EXPOSE 3000

# 🚀 Start command: in package.json, "start" should point to dist/index.js
CMD ["npm", "run", "dev"]
