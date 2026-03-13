# Build stage
FROM public.ecr.aws/lambda/nodejs:24.2026.03.12.12 AS builder

WORKDIR /var/task

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

# Runtime stage
FROM public.ecr.aws/lambda/nodejs:24.2026.03.12.12

WORKDIR /var/task

COPY --from=builder /var/task/dist ./dist

CMD ["index.handler"]
