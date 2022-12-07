from rest_framework.response import Response


class TextJSONResponse(Response):
    def __init__(
        self,
        data=None,
        status=None,
        template_name=None,
        headers=None,
        exception=False,
        content_type=None,
    ):
        super().__init__(data, status, template_name, headers, exception, content_type)

        if isinstance(self.data, str):
            self.data = {"message": self.data}
