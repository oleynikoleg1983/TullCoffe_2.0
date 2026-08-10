CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,

    site_id BIGINT NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    price NUMERIC(10, 2) NOT NULL DEFAULT 0,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    category_id BIGINT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_by BIGINT,
    updated_by BIGINT,

    user_salary NUMERIC(10, 2),

    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE product_sales (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);