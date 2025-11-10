-- Check for duplicate models
SELECT name, COUNT(*) as count
FROM home_models_showcase
GROUP BY name
HAVING COUNT(*) > 1;

-- Show all models with their IDs
SELECT id, name, order_index, created_at
FROM home_models_showcase
ORDER BY order_index, created_at;

-- Delete duplicates, keeping only the oldest entry for each name
DELETE FROM home_models_showcase
WHERE id NOT IN (
  SELECT MIN(id)
  FROM home_models_showcase
  GROUP BY name
);

-- Verify the result
SELECT * FROM home_models_showcase ORDER BY order_index;
