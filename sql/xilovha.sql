-- =====================================================================
-- XILOVHA: cuentas, avance y ranking.
-- Pega todo este archivo en Supabase > SQL Editor y pulsa Run. Se ejecuta una sola vez.
-- Reutiliza la función es_admin() que ya existe del proyecto Patronista Digital,
-- así que la misma cuenta de administradora sirve para el panel de XILOVHA.
-- =====================================================================

-- 1. Un perfil por cuenta: nombre de jugador, puntos, tiempo y todo su avance
create table public.xilovha_perfiles (
    user_id    uuid primary key references auth.users (id) on delete cascade,
    correo     text,
    nombre     text not null check (char_length(trim(nombre)) between 2 and 24),
    nombre_min text generated always as (lower(trim(nombre))) stored unique,
    puntos     integer not null default 0 check (puntos between 0 and 100000),
    segundos   integer not null default 0 check (segundos between 0 and 10000000),
    progreso   jsonb   not null default '{}' check (pg_column_size(progreso) < 20000),
    ultima_vez timestamptz not null default now(),
    creado     timestamptz not null default now()
);

-- El correo y la hora de conexión los pone la base de datos, no el navegador
create function public.xilovha_antes() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
    new.correo := (select email from auth.users where id = new.user_id);
    new.ultima_vez := now();
    if tg_op = 'UPDATE' then
        new.creado := old.creado;
        new.user_id := old.user_id;
    end if;
    return new;
end;
$$;

create trigger xilovha_antes before insert or update on public.xilovha_perfiles
    for each row execute function public.xilovha_antes();

-- 2. Reglas: cada quien ve y cambia solo lo suyo; la administradora ve y borra todo
alter table public.xilovha_perfiles enable row level security;

create policy "xilovha dueno o admin leen" on public.xilovha_perfiles
    for select to authenticated using (user_id = auth.uid() or public.es_admin());
create policy "xilovha dueno crea" on public.xilovha_perfiles
    for insert to authenticated with check (user_id = auth.uid());
create policy "xilovha dueno cambia" on public.xilovha_perfiles
    for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "xilovha admin borra" on public.xilovha_perfiles
    for delete to authenticated using (public.es_admin());

-- 3. Ranking público: solo nombre, puntos, tiempo y si está en línea (nunca el correo)
create view public.xilovha_ranking as
    select nombre,
           puntos,
           segundos,
           ultima_vez,
           progreso -> 'vestidor' ->> 'modelo' as modelo,
           (ultima_vez > now() - interval '2 minutes') as en_linea
    from public.xilovha_perfiles;

grant select on public.xilovha_ranking to anon, authenticated;

-- Debe mostrar 0 jugadores (todavía nadie se ha registrado)
select count(*) as jugadores from public.xilovha_perfiles;
