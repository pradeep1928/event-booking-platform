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

<!-- migrate prisma schema - run in backend -->
npx prisma migrate dev --name add_password_reset_token

npx prisma generate

<!-- prisma ui studio -->
npx prisma studio