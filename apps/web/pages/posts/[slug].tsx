import * as React from "react"
import { useRouter } from "next/router"
import createClient from "inside-out/src/client"
import contentfulClient from "../../contentful"

const Post = (props: any) => {
  const router = useRouter()
  const { slug } = router.query
  console.log({ props })

  return (
    <div>
      <h1>{props.post.fields.title}</h1>
    </div>
  )
}

export default Post

export async function getServerSideProps(context: any) {
  const insideOut = createClient({ port: 11111 })
  const slug = context.params.slug
  // const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${pid}`)
  // const post = await res.json()
  const post = await contentfulClient
    .getEntries({
      content_type: `blogPost`,
      "fields.slug[in]": slug,
    })
    .then((entry: any) => {
      console.log({ entry: entry.items })
      return entry.items[0]
    })
  if (post) {
    insideOut.createDependency({
      nodeId: post.sys.id,
      target: { id: context.resolvedUrl, path: context.resolvedUrl, type: 0 },
    })
  }
  // console.log({
  // dependencies: insideOut.getPathDependencies(context.resolvedUrl),
  // })
  return {
    props: { foo: true, post },
  }
}
