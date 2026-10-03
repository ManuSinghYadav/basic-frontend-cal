provider "aws" {
  region = "ap-south-1"
}

resource "aws_iam_user" "existing_user" {
  name = "cal-del"
}

import {
  to = aws_iam_user.existing_user
  id = "cal-del"
}
