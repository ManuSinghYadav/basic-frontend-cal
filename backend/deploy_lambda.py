import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PACKAGE_DIR = ROOT / "lambda_package"
ZIP_FILE = ROOT / "lambda_deployment.zip"

DOCKER_IMAGE = "public.ecr.aws/lambda/python:3.12"


def clean():
    """Remove the previous deployment package."""

    print("Cleaning previous build...")

    if PACKAGE_DIR.exists():
        shutil.rmtree(PACKAGE_DIR)

    if ZIP_FILE.exists():
        ZIP_FILE.unlink()

    PACKAGE_DIR.mkdir(parents=True)

    print("Clean build directory created.")


def install_dependencies():
    """Install dependencies using the Lambda Linux ARM64 environment."""

    print("\nInstalling Lambda dependencies...")

    command = [
        "docker",
        "run",
        "--rm",

        # Build for AWS Lambda ARM64
        "--platform",
        "linux/arm64",

        # Lambda image normally expects a handler as its argument.
        # Override that so we can directly run pip.
        "--entrypoint",
        "pip",

        # Mount our backend directory into the container.
        "-v",
        f"{ROOT}:/var/task",

        DOCKER_IMAGE,

        "install",

        "-r",
        "/var/task/requirements.txt",

        "-t",
        "/var/task/lambda_package",
    ]

    subprocess.run(command, check=True)

    print("Dependencies installed.")


def copy_source_files():
    """Copy Python source files while preserving the project structure."""

    print("\nCopying source files...")

    excluded_dirs = {
        "lambda_package",
        ".venv",
        "__pycache__",
        ".git",
    }

    for path in ROOT.rglob("*.py"):

        # Don't copy this deployment script itself.
        if path == Path(__file__).resolve():
            continue

        # Don't copy files inside excluded directories.
        if any(part in excluded_dirs for part in path.parts):
            continue

        relative_path = path.relative_to(ROOT)

        destination = PACKAGE_DIR / relative_path

        destination.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        shutil.copy2(
            path,
            destination,
        )

    print("Source files copied.")


def create_zip():
    """Create the Lambda deployment ZIP."""

    print("\nCreating deployment ZIP...")

    shutil.make_archive(
        str(ZIP_FILE.with_suffix("")),
        "zip",
        PACKAGE_DIR,
    )

    print("ZIP created.")


def show_contents():
    """Show the resulting deployment package."""

    print("\nDeployment package contents:")

    for path in sorted(PACKAGE_DIR.rglob("*")):

        if path.is_file():
            print(
                " ",
                path.relative_to(PACKAGE_DIR),
            )

    print("\n--------------------------------")
    print("Deployment package ready!")
    print("--------------------------------")

    print(f"\nFolder:")
    print(PACKAGE_DIR)

    print(f"\nZIP:")
    print(ZIP_FILE)


def main():
    clean()
    install_dependencies()
    copy_source_files()
    create_zip()
    show_contents()


if __name__ == "__main__":
    main()