import logging

logging.basicConfig(
    filename="log.log",
    level=logging.DEBUG,
    format="%(levelname)s:  %(asctime)s - %(message)s",
    datefmt='%d-%b-%y %H:%M:%S'
)

log = logging.getLogger(__name__)
