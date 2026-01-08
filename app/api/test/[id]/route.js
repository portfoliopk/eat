export async function GET(request, context) {
  return Response.json({
    params: context.params,
  });
}
