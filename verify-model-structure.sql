-- Check the exact structure and data in home_models_showcase
SELECT 
  id,
  name,
  range,
  charge,
  speed,
  bg_color,
  image_url,
  order_index,
  created_at,
  updated_at
FROM home_models_showcase 
ORDER BY order_index;
