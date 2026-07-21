run backend 
>npm run dev:backend

run frontend
>npm run dev:frontend

<!-- run postgres via docker -->
docker exec -it event-booking-postgres psql -U postgres -d event_booking

<!-- compose file down  -->
docker compose -f docker/compose.yml down

<!-- run docker compose file -->
docker compose -f docker/compose.yml up -d