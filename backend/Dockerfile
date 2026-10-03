FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_CACHE_DIR=/home/appuser/.cache/uv

# Install uv binary
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /code

# Create non-privileged user and home directory
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/home/appuser" \
    --shell "/sbin/nologin" \
    --uid "${UID}" \
    appuser

# Create app directory and cache directory with proper ownership
RUN mkdir -p /code /home/appuser/.cache/uv && \
    chown -R appuser:appuser /code /home/appuser

# Copy dependency files and adjust ownership
COPY --chown=appuser:appuser uv.lock pyproject.toml ./

# Switch to appuser BEFORE running uv sync
USER appuser

# Install dependencies as appuser
RUN uv sync --frozen --no-install-project && uv cache prune --ci

# Switch back briefly to root to copy project files with correct ownership
USER root
COPY --chown=appuser:appuser . .

# Switch back to appuser for runtime
USER appuser

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "routes.api:app", "--host", "0.0.0.0", "--port", "8000"]
