@echo off
chcp 65001 > nul
echo === CineLens Docker 재빌드 (데이터 유지) ===
docker-compose down
docker-compose up --build