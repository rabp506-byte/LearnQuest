create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  role text not null default 'student'
    check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,

  hp integer not null default 50 check (hp >= 0),
  max_hp integer not null default 50 check (max_hp > 0),

  xp integer not null default 0 check (xp >= 0),

  ap integer not null default 50 check (ap >= 0),
  max_ap integer not null default 50 check (max_ap > 0),

  pp integer not null default 0 check (pp >= 0),

  level integer not null default 1 check (level >= 1),

  class text not null
    check (class in ('guerrero', 'mago', 'curandero')),

  gold integer not null default 0 check (gold >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (hp <= max_hp),
  check (ap <= max_ap)
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),

  class text not null
    check (class in ('guerrero', 'mago', 'curandero')),

  nombre text not null,
  costo_ap integer not null check (costo_ap >= 0),
  efecto text not null,

  created_at timestamptz not null default now(),

  unique (class, nombre)
);

create table if not exists action_logs (
  id uuid primary key default gen_random_uuid(),

  character_id uuid not null references characters(id) on delete cascade,

  action_type text not null
    check (action_type in ('xp_gain', 'hp_loss', 'level_up', 'ap_change', 'gold_change')),

  xp_change integer not null default 0,
  hp_change integer not null default 0,
  ap_change integer not null default 0,
  gold_change integer not null default 0,

  description text,
  created_at timestamptz not null default now()
);

create or replace function calculate_character_level()
returns trigger
language plpgsql
as $$
declare
  required_xp numeric;
  old_level integer;
begin
  old_level := coalesce(old.level, new.level);

  if new.level < 1 then
    new.level := 1;
  end if;

  loop
    required_xp := 100 * power(new.level::numeric, 1.5);

    exit when new.xp < required_xp;

    new.level := new.level + 1;
    new.pp := new.pp + 1;
    new.max_hp := new.max_hp + 5;
    new.max_ap := new.max_ap + 2;
    new.hp := new.max_hp;
    new.ap := new.max_ap;
  end loop;

  new.updated_at := now();

  return new;
end;
$$;

drop trigger if exists trg_calculate_character_level on characters;

create trigger trg_calculate_character_level
before insert or update of xp
on characters
for each row
execute function calculate_character_level();

create or replace function log_level_up()
returns trigger
language plpgsql
as $$
begin
  if new.level > old.level then
    insert into action_logs (
      character_id,
      action_type,
      description
    )
    values (
      new.id,
      'level_up',
      'Character leveled up from level ' || old.level || ' to level ' || new.level
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_log_level_up on characters;

create trigger trg_log_level_up
after update of xp
on characters
for each row
when (new.level > old.level)
execute function log_level_up();

insert into skills (class, nombre, costo_ap, efecto)
values
  (
    'guerrero',
    'Protección',
    10,
    'Gasta AP para recibir el daño en lugar de un aliado.'
  ),
  (
    'mago',
    'Transferencia de Maná',
    10,
    'Gasta AP para recargar los AP de un aliado.'
  ),
  (
    'curandero',
    'Curación',
    10,
    'Gasta AP para restaurar HP de un aliado.'
  )
on conflict (class, nombre) do nothing;
