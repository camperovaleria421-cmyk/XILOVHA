-- =====================================================================
-- XILOVHA: cada respuesta de los juegos (pregunta, respuesta, si fue
-- correcta y cuántos segundos tardó). Ejecútalo UNA vez en
-- Supabase > SQL Editor, después de xilovha.sql.
-- =====================================================================

create table public.xilovha_respuestas (
    id         bigint generated always as identity primary key,
    user_id    uuid not null references public.xilovha_perfiles (user_id) on delete cascade,
    partida    text not null check (char_length(partida) <= 40),
    juego      text not null check (char_length(juego) <= 20),
    pregunta   text not null check (char_length(pregunta) <= 80),
    respuesta  text check (char_length(respuesta) <= 160),
    correcta   boolean not null,
    segundos   numeric(6,1) not null check (segundos >= 0 and segundos < 3600),
    creado     timestamptz not null default now()
);

create index xilovha_respuestas_usuario on public.xilovha_respuestas (user_id, creado desc);

-- La hora la pone la base de datos, no el navegador
create function public.xilovha_respuesta_hora() returns trigger
language plpgsql set search_path = '' as $$
begin
    new.creado := now();
    return new;
end;
$$;

create trigger xilovha_respuesta_hora before insert on public.xilovha_respuestas
    for each row execute function public.xilovha_respuesta_hora();

-- Reglas: cada quien agrega solo sus respuestas; la administradora las ve y las borra
alter table public.xilovha_respuestas enable row level security;

create policy "xilovha resp dueno agrega" on public.xilovha_respuestas
    for insert to authenticated with check (user_id = auth.uid());
create policy "xilovha resp dueno o admin leen" on public.xilovha_respuestas
    for select to authenticated using (user_id = auth.uid() or public.es_admin());
create policy "xilovha resp admin borra" on public.xilovha_respuestas
    for delete to authenticated using (public.es_admin());

-- Debe mostrar 0
select count(*) as respuestas from public.xilovha_respuestas;
