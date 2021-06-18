export const trim = (s, c) => {
	if (c === "]") c = "\\]";
	if (c === "^") c = "\\^";
	if (c === "\\") c = "\\\\";
	return s.replace(new RegExp(
	  "^[" + c + "]+|[" + c + "]+$", "g"
	), "");
  }