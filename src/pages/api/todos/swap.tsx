import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const array = req.body.array;
    // sort array
    array.sort((a:number, b:number) => (a > b) ? 1 : -1);
    res.status(200).json(array);
}