class Copyright {
  text: string | undefined;
  type: string | undefined;
  constructor(data: Record<string, any>) {
    this.text = data?.text;
    this.type = data?.type;
  }
}

export default Copyright;
