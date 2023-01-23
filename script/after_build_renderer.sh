## replace all src="/ with src=" for electron to work
sed -i '' -e 's/src="\//src="/g' out/index.html
## copy public folder
cp -r src/public out/public
