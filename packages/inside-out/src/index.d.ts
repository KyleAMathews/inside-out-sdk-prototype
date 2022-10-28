export interface Target {
  id: string
  path: string
  // Type of dependency
  // 0: page-level dependency and the node drives the content of the page e.g. a blog post
  // 1: page-level dependency but a secondary part of the page e.g. a callout or other block of some sort
  type: number
  // Allow arbitrary other fields.
  [x: string | number | symbol]: unknown;
}
