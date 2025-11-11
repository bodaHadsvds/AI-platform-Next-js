let activeRequests = 0;
const maxConcurrent = 3;
const queue: (() => void)[] = [];
const maxQueueSize = 10;

export async function queueRequest(fn: () => Promise<Response>): Promise<Response> {
  if (activeRequests >= maxConcurrent) {
    if (queue.length >= maxQueueSize) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Queue full. Please try again later.",
        }),
        { status: 429 }
      );
    }

    return new Promise((resolve) => {
      queue.push(() => fn().then(resolve)); 
    });
   
  }

  activeRequests++;
  try {
    return await fn();
  } finally {
    activeRequests--;
    if (queue.length > 0) {
      const next = queue.shift();
      next && next();
    }
  }
}
