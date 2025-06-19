icons:
	bun ./script/iconToCss.ts src src/styles/icons.css

restart-prod:
	sudo systemctl restart the-finals.auto && sudo systemctl restart the-finals-api.auto
