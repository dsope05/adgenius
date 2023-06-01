const createAnimationPrompt = (prompt) => {
  if (prompt.length === 1) {
    return `0: ${prompt[0]}`
  } else {
    return `0: ${prompt[0]}| 50: ${prompt[1]}`
  }
}
export default async function handler(req, res) {
  const animationPrompt = createAnimationPrompt(req.body.prompt);
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
      version: "e22e77495f2fb83c34d5fae2ad8ab63c0a87b6b573b6208e1535b23b89ea66d6",

      // This is the text prompt that will be submitted by a form on the frontend
      input: {
        max_frames: 100,
        animation_prompts: animationPrompt
       },
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}