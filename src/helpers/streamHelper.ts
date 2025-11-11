export const createStream = <T>() => {
  const encoder = new TextEncoder();
  let controllerRef: ReadableStreamDefaultController<Uint8Array>;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controllerRef = controller;
    },
  });

  const send = (data: T) => {
    controllerRef.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  const close = () => controllerRef.close();

  return { stream, send, close };
};
