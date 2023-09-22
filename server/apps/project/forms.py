from typing import Any
from django import forms

from .models import Task


class TaskAdminForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = "__all__"

    def clean(self) -> dict[str, Any]:
        cleaned_data = self.cleaned_data

        # Check if start date is before end date
        # or end date is before start date
        start_date = cleaned_data.get("start_date")
        end_date = cleaned_data.get("end_date")

        if end_date and start_date > end_date:
            return self.add_error(
                "start_date", "Start date cannot be after the end date"
            )

        # Check if task does not reference itself as parent
        parent = self.cleaned_data.get("parent")

        if parent and self.instance == parent:
            return self.add_error("parent", "Cannot set the parent of the task to itself")

        return cleaned_data
