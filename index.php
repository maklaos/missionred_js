<?php
  if (isset($_GET['lang'])) {
    $language = $_GET['lang'];
  } else{
    $language = 'en';
  }
  if ($language != 'en') {
    if (!file_exists('lang/lang_' . $language . '.js')) {
      header('Location: ');
    }
  }
?>

<!doctype html>
<html lang="<?php echo $language; ?>">
<head>
    <title>Missionred</title>
    <meta charset='utf-8'>
	<link rel="stylesheet" href="style.min.css">
</head>
<body>

<div class="language">
  <a href="en">en</a>
  <a href="ua">ua</a>
  <a href="ru">ru</a>
  <a href="pl">pl</a>
</div>

<div id="wrapper">
	<canvas id='game' width='600' height='650'>Element not supported</canvas>
  <div id="scores"> </div>
</div>

<script type="text/javascript" src="lang.js"></script>
<script type="text/javascript" src="game.js"></script>
<?php
  if ($language != 'en') {
    echo '<script type="text/javascript" src="lang/lang_' . $language . '.js"></script>';
  }
?>

</body>
</html>
