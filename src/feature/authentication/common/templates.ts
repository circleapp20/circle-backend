export const VERIFICATION_CODE_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
		<!--<![endif]-->
		<!--[if (gte mso 9)|(IE)]>
			<xml>
				<o:OfficeDocumentSettings>
					<o:AllowPNG />
					<o:PixelsPerInch>96</o:PixelsPerInch>
				</o:OfficeDocumentSettings>
			</xml>
		<![endif]-->
		<!--[if (gte mso 9)|(IE)]>
			<style type="text/css">
				body {
					width: 600px;
					margin: 0 auto;
					font-family: 'Noto Sans', sans-serif;
				}
				table {
					border-collapse: collapse;
				}
				table,
				td {
					mso-table-lspace: 0pt;
					mso-table-rspace: 0pt;
				}
				img {
					-ms-interpolation-mode: bicubic;
				}
			</style>
		<![endif]-->
		<link
			href="https://fonts.googleapis.com/css?family=Noto+Sans&display=swap"
			rel="stylesheet"
		/>
		<style>
			* {
				box-sizing: border-box;
				margin: 0;
				padding: 0;
			}
		</style>
	</head>
	<body style="margin: 0; padding: 0; font-family: 'Noto Sans', sans-serif;">
		<div style="width: 100%; max-width: 600px; margin: auto; padding: 20px;">
			<div style="text-align: center;">
				<span style="text-transform: uppercase; letter-spacing: 5px; font-size: 15px;"
					>Circle</span
				>
			</div>
			<div
				style="
					background-color: rgb(207, 255, 247);
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 200px;
					margin: 30px 0;
					padding: 40px 20px;
				"
			>
				<h2
					style="
						font-size: 30px;
						letter-spacing: 10px;
						text-transform: uppercase;
						margin-bottom: 10px;
						text-align: center;
					"
				>
					Circle
				</h2>
				<h5
					style="
						font-size: 15px;
						font-weight: normal;
						text-align: center;
						line-height: 25px;
					"
				>
					Bringing Students Closer
				</h5>
			</div>
			<div class="content">
				<p style="margin-bottom: 25px; line-height: 28px;">
					<em>Welcome {user},</em>
				</p>
				<p style="margin-bottom: 25px; line-height: 28px;">
					Your circle account is ready for use, we only need you to verify that the new
					account was created by the owner of this email. Please enter the verification
					code below on the mobile application, and complete your profile setup.
				</p>
				<div
					style="
						text-align: center;
						background-color: lightgoldenrodyellow;
						margin: 25px auto 25px;
						max-width: 300px;
						padding: 25px 0;
					"
				>
					<h4 style="margin-bottom: 10px; font-weight: normal;">Verification Code</h4>
					<h1 style="letter-spacing: 8px; font-size: 45px;">
						<em>{verificationCode}</em>
					</h1>
				</div>
				<p style="margin-bottom: 25px; line-height: 28px;">
					If you did not attempt to create a new account, your password or email may be
					compromised. Please reset your credentials with a new, strong password for your
					Circle account.
				</p>
			</div>
			<div class="footer">
				<p style="margin-bottom: 25px; line-height: 28px;">
					Thanks, <br />
					The Circle Team
				</p>
			</div>
		</div>
	</body>
</html>

`;
