from convenience import *
from database import Database
from dbe_smoel_comment import SmoelComment


class SmoelComments(Database):
    def __init__(self):
        super().__init__(SmoelComment, "smoel_comments.json")

    def create(self, **kwargs) -> SmoelComment:
        text = kwargs["text"]
        if not text or type(text) != str or len(text) > SMOEL_MAX_COMMENT_LENGTH:
            raise ValueError(f"invalid 'text' argument: {text=}")

        Log.debug(f"Creating new smoel comment")
        smoel_comment = self.initialize_new_entry(**kwargs)

        return smoel_comment
