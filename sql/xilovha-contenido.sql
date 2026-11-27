-- =====================================================================
-- XILOVHA: textos de las funciones (F1, F2, F3, F4...) editados desde
-- el panel de administración. Ejecútalo UNA vez en
-- Supabase > SQL Editor, después de xilovha.sql.
-- Un renglón por menú; si un menú no tiene renglón, la app usa el texto original.
-- =====================================================================

create table public.xilovha_contenido (
    menu       text primary key check (char_length(menu) <= 20),
    datos      jsonb not null check (pg_column_size(datos) < 1000000),
    actualizado timestamptz not null default now()
);

-- La hora la pone la base de datos
create function public.xilovha_contenido_hora() returns trigger
language plpgsql set search_path = '' as $$
begin
    new.actualizado := now();
    return new;
end;
$$;

create trigger xilovha_contenido_hora before insert or update on public.xilovha_contenido
    for each row execute function public.xilovha_contenido_hora();

-- Reglas: todos pueden leer los textos; solo la administradora los cambia
alter table public.xilovha_contenido enable row level security;

create policy "xilovha contenido todos leen" on public.xilovha_contenido
    for select to anon, authenticated using (true);
create policy "xilovha contenido admin crea" on public.xilovha_contenido
    for insert to authenticated with check (public.es_admin());
create policy "xilovha contenido admin cambia" on public.xilovha_contenido
    for update to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "xilovha contenido admin borra" on public.xilovha_contenido
    for delete to authenticated using (public.es_admin());

grant select on public.xilovha_contenido to anon, authenticated;
grant insert, update, delete on public.xilovha_contenido to authenticated;

-- Debe mostrar 0 (todavía no has editado nada)
select count(*) as menus_editados from public.xilovha_contenido;
