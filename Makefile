TARGET_BIN="${HOME}/.local/bin"
BIN=saddlestitch
.DEFAULT_GOAL := $(BIN)

install: $(BIN)
	@@ echo "Installing $(BIN) to install to $(TARGET_BIN)"
	@@ cp -v ./$(BIN) $(TARGET_BIN)

$(BIN): script.bash build saddlestitch.js
	./build

clean:
	rm -f ./$(BIN)
	rm -rf ./node_modules

