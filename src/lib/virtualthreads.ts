type Generate3DInput = {
  frontImageUrl: string;
  backImageUrl: string;
  productId: string;
  name: string;
  category: string;
};

type Generate3DResult = {
  success: boolean;
  modelUrl: string;
  error: string;
};

function extractModelUrl(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const obj = payload as Record<string, unknown>;

  const direct = [obj.modelUrl, obj.glbUrl, obj.url].find((v) => typeof v === 'string');
  if (typeof direct === 'string') return direct;

  const data = obj.data;
  if (data && typeof data === 'object') {
    const nested = data as Record<string, unknown>;
    const nestedUrl = [nested.modelUrl, nested.glbUrl, nested.url].find((v) => typeof v === 'string');
    if (typeof nestedUrl === 'string') return nestedUrl;
  }

  return '';
}

export function hasVirtualThreadsConfig(): boolean {
  const apiBase = (process.env.VIRTUALTHREADS_API_URL ?? '').trim();
  const apiKey = (process.env.VIRTUALTHREADS_API_KEY ?? '').trim();
  return Boolean(apiBase && apiKey);
}

export async function generateVirtualThreads3DMockup(input: Generate3DInput): Promise<Generate3DResult> {
  const apiBase = (process.env.VIRTUALTHREADS_API_URL ?? '').trim().replace(/\/$/, '');
  const apiKey = (process.env.VIRTUALTHREADS_API_KEY ?? '').trim();

  if (!apiBase || !apiKey) {
    return {
      success: false,
      modelUrl: '',
      error: 'VirtualThreads configuration missing',
    };
  }

  if (!input.frontImageUrl || !input.backImageUrl) {
    return {
      success: false,
      modelUrl: '',
      error: 'Front and back images are required for 3D generation',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch(`${apiBase}/mockups/3d`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        frontImageUrl: input.frontImageUrl,
        backImageUrl: input.backImageUrl,
        productId: input.productId,
        name: input.name,
        category: input.category,
      }),
      signal: controller.signal,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        modelUrl: '',
        error: (payload as { error?: string }).error ?? `VirtualThreads request failed (${res.status})`,
      };
    }

    const modelUrl = extractModelUrl(payload);
    if (!modelUrl) {
      return {
        success: false,
        modelUrl: '',
        error: 'VirtualThreads response did not include model URL',
      };
    }

    return {
      success: true,
      modelUrl,
      error: '',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'VirtualThreads request failed';
    return {
      success: false,
      modelUrl: '',
      error: message,
    };
  } finally {
    clearTimeout(timeout);
  }
}
