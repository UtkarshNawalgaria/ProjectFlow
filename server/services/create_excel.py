import csv
import os
from datetime import datetime
import tempfile
from openpyxl import Workbook
from typing import List

from django.conf import settings

from apps.project.models import Task


FILE_EXPORT_PATH = os.path.join(settings.MEDIA_ROOT, "exports")


def format_fields(fields):
    formatted_fields = []

    for field in fields:
        if type(field) == datetime:
            pass

        formatted_fields.append(str(field))

    return formatted_fields


def create_tasks_file(
    *,
    format="csv",
    tasks: List[Task],
    fields: List[str],
):
    if format not in ["csv", "xlsx"]:
        raise ValueError("Invalid format. Use 'csv' or 'xlsx")

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f".{format}")
    headers = list(map(lambda text: " ".join(text.split("_")), fields))
    file_rows = [headers]

    for task in tasks:
        file_rows.append(format_fields([task[field] for field in fields]))

    if format == "csv":
        with open(temp_file.name, mode="w", newline="") as csv_file:
            writer = csv.writer(csv_file)
            writer.writerows(file_rows)
    else:
        workbook = Workbook()
        worksheet = workbook.active

        # Need to modify datetime to format that is compatible with excel
        for row in file_rows:
            worksheet.append(row)

        workbook.save(temp_file.name)

    temp_file.close()

    return temp_file
