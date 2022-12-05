USE sql_invoicing;

SELECT 
    'first_half_of_2019' AS time_period,
    SUM(invoice_total) AS invoices_sum,
    (SELECT 
            SUM(payment_total)
        FROM
            invoices
        WHERE
            invoice_date BETWEEN '2019-01-01' AND '2019-06-30') AS sum_pay,
    (SUM(invoice_total) - (SELECT sum_pay)) AS diff
FROM
    invoices
WHERE
    invoice_date BETWEEN '2019-01-01' AND '2019-06-30' 
UNION SELECT 
    'second_half_of_2019' AS time_period,
    SUM(invoice_total) AS invoices_sum,
    (SELECT 
            SUM(payment_total)
        FROM
            invoices
        WHERE
            invoice_date BETWEEN '2019-07-01' AND '2019-12-31') AS sum_pay,
    (SUM(invoice_total) - (SELECT sum_pay)) AS diff
FROM
    invoices
WHERE
    invoice_date BETWEEN '2019-07-01' AND '2019-12-31';
    
-- -------------------------------------------------------------------------------------- 
SELECT 
    SUM(amount) AS sum_by_payment_method, payment_methods.name
FROM
    payments
        JOIN
    payment_methods ON payment_method = payment_method_id
WHERE
    payment_method = 1 
UNION SELECT 
    SUM(amount) AS sum_by_payment_method, payment_methods.name
FROM
    payments
        JOIN
    payment_methods ON payment_method = payment_method_id
WHERE
    payment_method = 2;

-- -------------------------------------------------------------------------------------- 

USE sql_store;

SELECT 
    customer_id, first_name, last_name, state, SUM(quantity * unit_price) AS sum
FROM
    customers
        JOIN
    orders USING (customer_id)
        JOIN
    order_items USING (order_id)
GROUP BY state
HAVING state = 'VA' AND sum > 100;


-- -------------------------------------------------------------------------------------- 

USE sql_hr;


SELECT 
    *
FROM
    employees
WHERE
    salary > (SELECT 
            AVG(salary)
        FROM
            employees AS average);


-- -------------------------------------------------------------------------------------- 

USE sql_invoicing;


SELECT 
    *
FROM
    clients
WHERE
    NOT EXISTS( SELECT 
            client_id
        FROM
            invoices
        WHERE
            clients.client_id = invoices.client_id);

-- --------------------------------------------------------------------------------------

SELECT 
    *
FROM
    invoices
        JOIN
    clients USING (client_id)
WHERE
    invoice_total > (SELECT 
            AVG(invoice_total)
        FROM
            invoices
        WHERE
            clients.client_id = invoices.client_id);
            
            
-- --------------------------------------------------------------------------------------

USE sql_store;

SELECT 
    *
FROM
    products
WHERE
    NOT EXISTS( SELECT 
            product_id
        FROM
            order_items
        WHERE
            order_items.product_id = products.product_id);
            
-- --------------------------------------------------------------------------------------
USE sql_invoicing;


SELECT 
    client_id,
    name,
    COUNT(client_id) AS total_sales,
    (SELECT 
            AVG(invoice_total)
        FROM
            invoices) AS average,
    (invoice_total - (SELECT average)) AS diff
FROM
    clients
        JOIN
    invoices USING (client_id)
GROUP BY client_id;
