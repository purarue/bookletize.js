usage="Converts a pdf to saddlestitch (zine format)

Usage:
  saddlestitch <INPUT_PDF> <OUTPUT_PDF>

Examples:
  saddlestitch input.pdf output.pdf"

if [[ "$1" =~ ^[-]{1,2}h(elp)?$ ]]; then
	echo "${usage}"
	exit 0
fi

if [[ -z "$2" ]]; then
  echo "You must provide input/output files" >&2
  echo "$usage"
  exit 1
fi
