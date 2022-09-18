import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(levelname)s:  %(asctime)s - %(message)s",
    datefmt='%d-%b-%y %H:%M:%S'
)

logger = logging.getLogger(__name__)
