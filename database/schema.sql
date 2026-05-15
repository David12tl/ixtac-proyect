-- ============================================
-- ECOIXTAC - Plataforma de Turismo Sustentable
-- Esquema de Base de Datos PostgreSQL
-- ============================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLAS PRINCIPALES
-- ============================================

-- Tabla de Roles de Usuario
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'turista', 'artesano', 'guia', 'admin'
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    location VARCHAR(255),
    role_id INTEGER REFERENCES roles(id) DEFAULT 1,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    total_services INTEGER DEFAULT 0,
    specialties TEXT[], -- Para artesanos y guías
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Tabla de Proveedores (extensión para artesanos y guías)
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    business_address TEXT,
    tax_id VARCHAR(50),
    website VARCHAR(255),
    social_media JSONB DEFAULT '{}',
    certification_docs TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. ATRACTIVOS TURÍSTICOS
-- ============================================

-- Tipos de atractivos
CREATE TABLE attraction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'restaurante', 'sitio_historico', 'taller', 'mirador', 'cascada', 'museo', 'mercado'
    icon VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Atractivos Turísticos
CREATE TABLE attractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type_id INTEGER REFERENCES attraction_types(id),
    description TEXT,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    coordinates GEOGRAPHY(POINT, 4326), -- Para consultas geoespaciales
    image_url TEXT,
    gallery TEXT[],
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    price_range VARCHAR(3) CHECK (price_range IN ('$', '$$', '$$$')),
    opening_hours JSONB, -- {"monday": "9:00-18:00", ...}
    phone VARCHAR(20),
    website VARCHAR(255),
    features TEXT[],
    best_time_to_visit TEXT,
    is_accessible BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. SERVICIOS TURÍSTICOS
-- ============================================

-- Categorías de servicios
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'artesanias', 'talleres', 'tours', 'gastronomia', 'alojamiento'
    icon VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Servicios
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES service_categories(id),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MXN',
    duration VARCHAR(50), -- '3 horas', '6 horas', etc.
    location VARCHAR(255),
    image_url TEXT,
    gallery TEXT[],
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    max_capacity INTEGER,
    badge VARCHAR(50), -- 'Popular', 'Orgánico', etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disponibilidad de servicios
CREATE TABLE service_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(50), -- '9:00-12:00', '14:00-18:00'
    available_spots INTEGER NOT NULL,
    booked_spots INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id, date, time_slot)
);

-- ============================================
-- 4. EVENTOS
-- ============================================

-- Tipos de eventos
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'feria', 'taller', 'festival', 'degustacion', 'concierto', 'exposicion'
    icon VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Eventos
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type_id INTEGER REFERENCES event_types(id),
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    time VARCHAR(100), -- '10:00 AM - 8:00 PM'
    location VARCHAR(255) NOT NULL,
    address TEXT,
    coordinates GEOGRAPHY(POINT, 4326),
    image_url TEXT,
    price VARCHAR(100), -- 'Entrada libre', '$250 - $500 MXN'
    capacity INTEGER,
    available_spots INTEGER,
    organizer VARCHAR(255),
    contact_info JSONB, -- {phone, email, website}
    features TEXT[],
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_days VARCHAR(20)[], -- ['Lunes', 'Miércoles', 'Viernes']
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. RESERVAS Y PEDIDOS
-- ============================================

-- Estados de reservas
CREATE TABLE booking_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'pending', 'confirmed', 'cancelled', 'completed'
    description TEXT,
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reservas de Servicios
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id),
    user_id UUID REFERENCES users(id),
    availability_id UUID REFERENCES service_availability(id),
    status_id INTEGER REFERENCES booking_statuses(id) DEFAULT 1,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. INTERACCIONES DE USUARIOS
-- ============================================

-- Reseñas
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('service', 'attraction', 'event', 'provider')),
    target_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- Si la reseña es de una compra/experiencia verificada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

-- Favoritos
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('service', 'attraction', 'event')),
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

-- ============================================
-- 7. RUTAS TURÍSTICAS
-- ============================================

-- Rutas
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50), -- '1 día', '2 días'
    difficulty VARCHAR(20) CHECK (difficulty IN ('fácil', 'moderado', 'difícil')),
    theme VARCHAR(100), -- 'Café', 'Cascadas', 'Artesanal'
    icon VARCHAR(20),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Puntos en rutas
CREATE TABLE route_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    attraction_id UUID REFERENCES attractions(id),
    order_index INTEGER NOT NULL,
    notes TEXT,
    estimated_duration VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, order_index)
);

-- ============================================
-- 8. NOTIFICACIONES
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'booking_confirmation', 'review_received', 'event_reminder'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. ÍNDICES Y OPTIMIZACIÓN
-- ============================================

-- Índices para usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_rating ON users(rating DESC);

-- Índices para atractivos
CREATE INDEX idx_attractions_type ON attractions(type_id);
CREATE INDEX idx_attractions_location ON attractions(location);
CREATE INDEX idx_attractions_rating ON attractions(rating DESC);
CREATE INDEX idx_attractions_coordinates ON attractions USING GIST(coordinates);

-- Índices para servicios
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_rating ON services(rating DESC);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = TRUE;

-- Índices para eventos
CREATE INDEX idx_events_type ON events(type_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_events_active ON events(is_active) WHERE is_active = TRUE;

-- Índices para reservas
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- Índices para disponibilidad
CREATE INDEX idx_availability_service ON service_availability(service_id);
CREATE INDEX idx_availability_date ON service_availability(date);

-- Índices para reseñas
CREATE INDEX idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- Índices para favoritos
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_target ON favorites(target_type, target_id);

-- ============================================
-- 10. VISTAS ÚTILES
-- ============================================

-- Vista de servicios con información completa
CREATE VIEW services_full AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.price,
    s.duration,
    s.location,
    s.image_url,
    s.rating,
    s.total_reviews,
    s.badge,
    sc.name as category,
    sc.icon as category_icon,
    p.business_name as provider_name,
    p.is_verified as provider_verified,
    u.name as provider_user_name,
    u.avatar_url as provider_avatar,
    r.name as provider_role
FROM services s
JOIN service_categories sc ON s.category_id = sc.id
JOIN providers p ON s.provider_id = p.id
JOIN users u ON p.user_id = u.id
JOIN roles r ON u.role_id = r.id
WHERE s.is_active = TRUE;

-- Vista de eventos próximos
CREATE VIEW upcoming_events AS
SELECT 
    e.id,
    e.title,
    e.description,
    e.start_date,
    e.end_date,
    e.time,
    e.location,
    e.price,
    e.available_spots,
    e.image_url,
    et.name as type,
    et.icon as type_icon,
    e.is_recurring,
    e.recurring_days
FROM events e
JOIN event_types et ON e.type_id = et.id
WHERE e.is_active = TRUE 
    AND (e.end_date IS NULL OR e.end_date >= CURRENT_TIMESTAMP)
ORDER BY e.start_date ASC;

-- Vista de atractivos mejor valorados
CREATE VIEW top_rated_attractions AS
SELECT 
    a.id,
    a.name,
    a.description,
    a.location,
    a.image_url,
    a.rating,
    a.total_reviews,
    a.price_range,
    at.name as type,
    at.icon as type_icon
FROM attractions a
JOIN attraction_types at ON a.type_id = at.id
WHERE a.is_active = TRUE AND a.rating >= 4.0
ORDER BY a.rating DESC, a.total_reviews DESC
LIMIT 20;

-- ============================================
-- 11. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar fecha de actualización
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attractions_updated_at BEFORE UPDATE ON attractions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar rating promedio
CREATE OR REPLACE FUNCTION update_rating(target_type VARCHAR, target_id UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    SELECT COALESCE(AVG(rating), 0), COUNT(*) 
    INTO avg_rating, review_count
    FROM reviews 
    WHERE reviews.target_type = target_type AND reviews.target_id = target_id;
    
    CASE target_type
        WHEN 'service' THEN
            UPDATE services SET rating = avg_rating, total_reviews = review_count WHERE id = target_id;
        WHEN 'attraction' THEN
            UPDATE attractions SET rating = avg_rating, total_reviews = review_count WHERE id = target_id;
        WHEN 'provider' THEN
            UPDATE providers p SET is_verified = true WHERE id = target_id; -- Lógica simple
        WHEN 'event' THEN
            -- Los eventos no tienen rating directo
            NULL;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar rating después de insertar/actualizar reseña
CREATE OR REPLACE TRIGGER after_review_insert
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_rating(NEW.target_type, NEW.target_id);

-- Función para verificar disponibilidad
CREATE OR REPLACE FUNCTION check_availability(
    p_service_id UUID,
    p_date DATE,
    p_time_slot VARCHAR,
    p_quantity INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    available INTEGER;
BEGIN
    SELECT available_spots - booked_spots 
    INTO available
    FROM service_availability
    WHERE service_id = p_service_id 
        AND date = p_date 
        AND time_slot = p_time_slot
        AND is_active = TRUE;
    
    RETURN available >= p_quantity;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 12. DATOS INICIALES (SEED)
-- ============================================

-- Roles por defecto
INSERT INTO roles (name, description, permissions) VALUES
('turista', 'Usuario que visita y reserva servicios', '{"can_book": true, "can_review": true}'),
('artesano', 'Proveedor de artesanías y talleres', '{"can_publish_services": true, "can_manage_bookings": true}'),
('guia', 'Guía turístico certificado', '{"can_publish_services": true, "can_manage_bookings": true}'),
('admin', 'Administrador de la plataforma', '{"can_manage_all": true, "can_verify_providers": true}');

-- Categorías de servicios
INSERT INTO service_categories (name, icon, description) VALUES
('artesanias', '🎨', 'Productos artesanales hechos a mano'),
('talleres', '👨‍🎨', 'Talleres y experiencias de aprendizaje'),
('tours', '🥾', 'Tours guiados y excursiones'),
('gastronomia', '🍽️', 'Experiencias gastronómicas'),
('alojamiento', '🏠', 'Hospedaje y alojamiento');

-- Tipos de atractivos
INSERT INTO attraction_types (name, icon, description) VALUES
('restaurante', '🍽️', 'Restaurantes y lugares para comer'),
('sitio_historico', '🏛️', 'Sitios históricos y culturales'),
('taller', '👨‍🎨', 'Talleres artesanales'),
('mirador', '🏔️', 'Miradores y puntos panorámicos'),
('cascada', '💧', 'Cascadas y cuerpos de agua'),
('museo', '🎭', 'Museos y galerías'),
('mercado', '🛒', 'Mercados y tiendas locales');

-- Tipos de eventos
INSERT INTO event_types (name, icon, description) VALUES
('feria', '🎪', 'Ferias y mercados temporales'),
('taller', '👨‍🎨', 'Talleres y clases'),
('festival', '🎉', 'Festivales y celebraciones'),
('degustacion', '🍷', 'Degustaciones de comida y bebida'),
('concierto', '🎵', 'Conciertos y presentaciones musicales'),
('exposicion', '🎨', 'Exposiciones de arte y cultura');

-- Estados de reservas
INSERT INTO booking_statuses (name, description, color) VALUES
('pending', 'Reserva pendiente de confirmación', '#F59E0B'),
('confirmed', 'Reserva confirmada', '#10B981'),
('cancelled', 'Reserva cancelada', '#EF4444'),
('completed', 'Reserva completada', '#3B82F6');

-- ============================================
-- 13. COMENTARIOS DE SEGURIDAD
-- ============================================

-- Nota: En producción, se recomienda:
-- 1. Usar Row Level Security (RLS) para control de acceso
-- 2. Encriptar datos sensibles
-- 3. Implementar auditoría de cambios
-- 4. Configurar backups automáticos
-- 5. Usar conexiones SSL

-- Ejemplo de política RLS (descomentar en producción)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY users_policy ON users
--     FOR ALL
--     USING (auth.uid() = id OR EXISTS (
--         SELECT 1 FROM roles WHERE roles.id = users.role_id AND roles.name = 'admin'
--     ));

-- ============================================
-- FIN DEL ESQUEMA
-- ============================================