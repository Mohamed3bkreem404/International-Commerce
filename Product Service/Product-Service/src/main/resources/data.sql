insert into product (id, product_name, product_description, product_price, stock_quantity, created_at, updated_at)
values ('11111111-1111-1111-1111-111111111111', 'Canvas Tote', 'Daily tote bag for books, groceries, and cables.', 24.99, 30, now(), now())
on conflict do nothing;

insert into product (id, product_name, product_description, product_price, stock_quantity, created_at, updated_at)
values ('22222222-2222-2222-2222-222222222222', 'Desk Lamp', 'Warm light desk lamp with adjustable neck.', 59.50, 18, now(), now())
on conflict do nothing;

insert into product (id, product_name, product_description, product_price, stock_quantity, created_at, updated_at)
values ('33333333-3333-3333-3333-333333333333', 'Studio Headphones', 'Closed-back headphones for work, study, and editing.', 129.00, 12, now(), now())
on conflict do nothing;
