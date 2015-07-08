<?php
require_once('email_test.php');

$js_submission = (bool)intval($_POST['js-submission']);
$success = false;
$errorFields = array();

if ($_POST) {
	$_POST['name'] = preg_replace('/\s+/', ' ', $_POST['name']);

	foreach(array_keys($_POST) as $key) {
		// Test for valid UTF-8 and XML/XHTML character range compatibility
		if (preg_match('@[^\x9\xA\xD\x20-\x{D7FF}\x{E000}-\x{FFFD}\x{10000}-\x{10FFFF}]@u', $_POST[$key])) {
			$errorFields[] = $key;
		}
	}

	if (strlen($_POST['message']) <= 0) {
		$errorFields[] = 'message';
	}

	if (!preg_match('/^[^<>]{1,200}$/', $_POST['name'])) {
		$errorFields[] = 'name';
	}

	if (!validEmail($_POST['email'])) {
		$errorFields[] = 'email';
	}

	if (count($errorFields) == 0) {
		$success = true;
		$to = 'hello@nickbrandt.me';
		$from = $_POST['email'];
		$headers = "From: hello@nickbrandt.me";
		$subject = 'My website contact submission';
		$message = <<<EMAIL

Name: {$_POST['name']}
Email: {$_POST['email']}

Message:
{$_POST['message']}
EMAIL;
		mail($to, $subject, $message, $headers);
	}
}else{
	header('Location: index.html');
}

if ($js_submission) {
	$result = array();
	$result['success'] = count($errorFields) == 0;
	$result['errors'] = $errorFields;
	echo json_encode($result);
} else {
	?><!DOCTYPE html>
	<html lang="en-US" class="no-js">
		<head>
			<title>Nick Brandt | Designer & Developer</title>
		</head>
		<body>
			<?php if (count($errorFields) > 0) { ?>
				An error occurred with your form submission.  Please click back and try again.
			<?php } else { ?>
				Thank you!
			<?php } ?>
		</body>
	</html><?php
}