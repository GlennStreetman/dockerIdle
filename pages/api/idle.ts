// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  msg: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('Next: Attempting reset idle queue')
  fetch('http://localhost:8080/api/idle')
  .then((response) => response)
  .then((data) => "Next: Idle Timer Reset complete");
  res.status(200).json({ msg: 'Next: Idle Timer Reset complete' })
}
