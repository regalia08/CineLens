@echo off
chcp 65001 > nul
echo === CineLens Docker 재빌드 (초기화) ===
docker-compose down -v
docker-compose up --build