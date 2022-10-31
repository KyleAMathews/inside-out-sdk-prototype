import type { NextApiRequest, NextApiResponse } from "next"
import createClient from "inside-out/src/client"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const insideOut = createClient({ port: 11111 })
  const body = JSON.parse(req.body)
  console.log(body.sys.id)
  const toInvalidate: Array<any> = (await insideOut.invalidateNode({
    nodeId: body.sys.id,
  })) as Array<any>
  console.log({ toInvalidate })

  // res.status(200).json({ name: `John Doe` })

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await Promise.all(toInvalidate.map((target) => res.revalidate(target.path)))
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send(`Error revalidating`)
  }
}
