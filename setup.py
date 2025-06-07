from setuptools import setup, find_packages

setup(
    name="life_clock",
    version="1.0.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "PyQt5",
        "pillow",
        "python-dateutil",
        "requests",
    ],
    author="人生時計開発者",
    author_email="example@example.com",
    description="人生の進み具合を可視化する時計アプリケーション",
    keywords="clock, life, visualization",
    python_requires=">=3.6",
    entry_points={
        "console_scripts": [
            "life-clock=run:main",
        ],
    },
)
